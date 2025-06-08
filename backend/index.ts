import { APIGatewayProxyEvent, Context, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    console.log(`[arena-bom-integration] Received event: ${JSON.stringify(event, null, 2)}`);
    console.log(`[arena-bom-integration] Context: ${context.functionName}, Request ID: ${context.awsRequestId}`);
    
    try {
        const body = event.body ? JSON.parse(event.body) : {};
        const name = body.name || 'World';
        const response = {
            statusCode: 200,
            body: JSON.stringify({ message: `Hello, ${name}!` })
        };
        console.log(`[arena-bom-integration] Response: ${JSON.stringify(response)}`);
        return response;
    } catch (error) {
        console.error(`[arena-bom-integration] Error: ${error}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};