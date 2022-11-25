import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { verify} from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { JwtPayload } from '../../auth/JwtPayload'

const logger = createLogger('auth');

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const jwksURL = process.env.JWKS_URL;


export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {

  logger.info('Authorizing', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('Authorization successful', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('Authorization failed', { error: e.message })
    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}
async function verifyToken(authHeader: string): Promise<JwtPayload> {
  try {
  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
    const token = getToken(authHeader)
    const jwks_data = await Axios.get(jwksURL);
    const key_text = jwks_data['data']['keys'][0]['x5c'][0]
    const certficate = '-----BEGIN CERTIFICATE-----\n' + key_text + '\n-----END CERTIFICATE-----'

    return verify(token, certficate,  {algorithms: ['RS256']}) as JwtPayload
  
  } catch(error){
    logger.error('Authentication Failed!', error)
  }
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const token = authHeader.split(' ')[1]
  return token
}
