module.exports = (sequelize, DataTypes) => {
  const VipRequest = sequelize.define('VipRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'user_email',
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'user_name',
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'model_name',
    },
    socialProfileLink: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'social_profile_link',
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'content_type',
    },
    additionalDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
      field: 'additional_details',
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
    },
    tier: {
      type: DataTypes.ENUM('diamond', 'lifetime'),
      allowNull: false,
    },
    contentLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
      field: 'content_link',
    },
    rejectionReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
      field: 'rejection_reason',
    },
    processedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'processed_by',
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'processed_at',
    },
  }, {
    tableName: 'VipRequests',
    timestamps: true,
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['status']
      },
      {
        fields: ['tier']
      },
      {
        fields: ['created_at']
      }
    ]
  });

  VipRequest.associate = function(models) {
    VipRequest.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    VipRequest.belongsTo(models.User, {
      foreignKey: 'processedBy',
      as: 'processor'
    });
  };

  return VipRequest;
};
