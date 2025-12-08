const express = require('express');
const router = express.Router();
const { User, VipRequest } = require('../models');
const verifyToken = require('../Middleware/verifyToken');
const isAdmin = require('../Middleware/isAdmin');
const { sendVipRequestEmail } = require('../Services/Emailsend');
const { Op } = require('sequelize');

router.post('/create', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { modelName, socialProfileLink, contentType, additionalDetails } = req.body;

    if (!modelName || !socialProfileLink || !contentType) {
      return res.status(400).json({
        message: 'Model name, social profile link, and content type are required'
      });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVip) {
      return res.status(403).json({ message: 'Only VIP members can submit requests' });
    }

    if (!user.vipTier || (user.vipTier !== 'diamond' && user.vipTier !== 'lifetime')) {
      return res.status(403).json({
        message: 'Only Diamond and Lifetime members can submit requests'
      });
    }

    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const monthlyRequestCount = await VipRequest.count({
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: new Date(now.getFullYear(), now.getMonth(), 1),
          [Op.lt]: new Date(now.getFullYear(), now.getMonth() + 1, 1)
        }
      }
    });

    const requestLimit = user.vipTier === 'lifetime' ? 2 : 1;

    if (monthlyRequestCount >= requestLimit) {
      return res.status(429).json({
        message: `You have reached your monthly request limit (${requestLimit} ${requestLimit === 1 ? 'request' : 'requests'})`,
        limit: requestLimit,
        used: monthlyRequestCount
      });
    }

    const vipRequest = await VipRequest.create({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      modelName,
      socialProfileLink,
      contentType,
      additionalDetails: additionalDetails || '',
      tier: user.vipTier,
      status: 'pending'
    });

    try {
      await sendVipRequestEmail({
        type: 'submitted',
        userEmail: user.email,
        userName: user.name,
        modelName,
        requestId: vipRequest.id
      });
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }

    res.status(201).json({
      message: 'Request submitted successfully',
      request: vipRequest,
      remainingRequests: requestLimit - monthlyRequestCount - 1
    });

  } catch (error) {
    console.error('Error creating VIP request:', error);
    res.status(500).json({ message: 'Error submitting request' });
  }
});

router.get('/my-requests', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { status, limit = 50, offset = 0 } = req.query;

    const whereClause = { userId };
    if (status) {
      whereClause.status = status;
    }

    const requests = await VipRequest.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'processor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    const total = await VipRequest.count({ where: whereClause });

    res.json({
      requests,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error fetching user requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

router.get('/my-limits', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const usedThisMonth = await VipRequest.count({
      where: {
        userId: userId,
        createdAt: {
          [Op.gte]: monthStart,
          [Op.lt]: monthEnd
        }
      }
    });

    const requestLimit = user.vipTier === 'lifetime' ? 2 : user.vipTier === 'diamond' ? 1 : 0;
    const nextResetDate = user.vipExpirationDate || new Date(now.getFullYear(), now.getMonth() + 1, 1);

    res.json({
      tier: user.vipTier,
      totalRequests: requestLimit,
      usedRequests: usedThisMonth,
      remainingRequests: Math.max(0, requestLimit - usedThisMonth),
      resetDate: nextResetDate
    });

  } catch (error) {
    console.error('Error fetching request limits:', error);
    res.status(500).json({ message: 'Error fetching request limits' });
  }
});

router.get('/admin/all', verifyToken, isAdmin, async (req, res) => {
  try {
    const { status, tier, limit = 100, offset = 0 } = req.query;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (tier) whereClause.tier = tier;

    const requests = await VipRequest.findAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'vipTier']
        },
        {
          model: User,
          as: 'processor',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    const stats = await VipRequest.findAll({
      attributes: [
        'status',
        'tier',
        [VipRequest.sequelize.fn('COUNT', '*'), 'count']
      ],
      group: ['status', 'tier']
    });

    const total = await VipRequest.count({ where: whereClause });
    const pending = await VipRequest.count({ where: { ...whereClause, status: 'pending' } });
    const approved = await VipRequest.count({ where: { ...whereClause, status: 'approved' } });
    const rejected = await VipRequest.count({ where: { ...whereClause, status: 'rejected' } });

    res.json({
      requests,
      stats: {
        total,
        pending,
        approved,
        rejected,
        byTierAndStatus: stats
      },
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    console.error('Error fetching all requests:', error);
    res.status(500).json({ message: 'Error fetching requests' });
  }
});

router.put('/admin/approve/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { contentLink } = req.body;
    const adminId = req.userId;

    if (!contentLink) {
      return res.status(400).json({ message: 'Content link is required' });
    }

    const request = await VipRequest.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        message: `Request has already been ${request.status}`
      });
    }

    await request.update({
      status: 'approved',
      contentLink,
      processedBy: adminId,
      processedAt: new Date()
    });

    try {
      await sendVipRequestEmail({
        type: 'approved',
        userEmail: request.user.email,
        userName: request.user.name,
        modelName: request.modelName,
        contentLink,
        requestId: request.id
      });
    } catch (emailError) {
      console.error('Failed to send approval email:', emailError);
    }

    res.json({
      message: 'Request approved successfully',
      request
    });

  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({ message: 'Error approving request' });
  }
});

router.put('/admin/reject/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;
    const adminId = req.userId;

    const request = await VipRequest.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        message: `Request has already been ${request.status}`
      });
    }

    await request.update({
      status: 'rejected',
      rejectionReason: rejectionReason || 'No reason provided',
      processedBy: adminId,
      processedAt: new Date()
    });

    try {
      await sendVipRequestEmail({
        type: 'rejected',
        userEmail: request.user.email,
        userName: request.user.name,
        modelName: request.modelName,
        rejectionReason: rejectionReason || 'No reason provided',
        requestId: request.id
      });
    } catch (emailError) {
      console.error('Failed to send rejection email:', emailError);
    }

    res.json({
      message: 'Request rejected successfully',
      request
    });

  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ message: 'Error rejecting request' });
  }
});

router.get('/admin/stats', verifyToken, isAdmin, async (req, res) => {
  try {
    const total = await VipRequest.count();
    const pending = await VipRequest.count({ where: { status: 'pending' } });
    const approved = await VipRequest.count({ where: { status: 'approved' } });
    const rejected = await VipRequest.count({ where: { status: 'rejected' } });

    const diamondPending = await VipRequest.count({
      where: { status: 'pending', tier: 'diamond' }
    });
    const lifetimePending = await VipRequest.count({
      where: { status: 'pending', tier: 'lifetime' }
    });

    const recentRequests = await VipRequest.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    res.json({
      stats: {
        total,
        pending,
        approved,
        rejected,
        diamondPending,
        lifetimePending
      },
      recentRequests
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

module.exports = router;
