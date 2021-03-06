import * as Sequelize from 'sequelize'

import { addMethodsToModel } from '../utils'
import {
  OAuthClientInstance,
  OAuthClientAttributes,

  OAuthClientMethods
} from './oauth-client-interface'

let OAuthClient: Sequelize.Model<OAuthClientInstance, OAuthClientAttributes>
let countTotal: OAuthClientMethods.CountTotal
let loadFirstClient: OAuthClientMethods.LoadFirstClient
let getByIdAndSecret: OAuthClientMethods.GetByIdAndSecret

export default function (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) {
  OAuthClient = sequelize.define<OAuthClientInstance, OAuthClientAttributes>('OAuthClient',
    {
      clientId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      clientSecret: {
        type: DataTypes.STRING,
        allowNull: false
      },
      grants: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      },
      redirectUris: {
        type: DataTypes.ARRAY(DataTypes.STRING)
      }
    },
    {
      indexes: [
        {
          fields: [ 'clientId' ],
          unique: true
        },
        {
          fields: [ 'clientId', 'clientSecret' ],
          unique: true
        }
      ]
    }
  )

  const classMethods = [
    associate,

    countTotal,
    getByIdAndSecret,
    loadFirstClient
  ]
  addMethodsToModel(OAuthClient, classMethods)

  return OAuthClient
}

// ---------------------------------------------------------------------------

function associate (models) {
  OAuthClient.hasMany(models.OAuthToken, {
    foreignKey: 'oAuthClientId',
    onDelete: 'cascade'
  })
}

countTotal = function () {
  return OAuthClient.count()
}

loadFirstClient = function () {
  return OAuthClient.findOne()
}

getByIdAndSecret = function (clientId: string, clientSecret: string) {
  const query = {
    where: {
      clientId: clientId,
      clientSecret: clientSecret
    }
  }

  return OAuthClient.findOne(query)
}
