import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter{
  catch(exception: RpcException, host: ArgumentsHost){
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const rpcError = exception.getError()
    
    if (typeof rpcError === 'object' && 'status' in rpcError && typeof rpcError.status === 'number' && 'message' in rpcError)  {
      return response.status(rpcError.status).json(rpcError);
    }
    response.status(400).json({
      status: 400,
      message: rpcError,
    });
    
  }
}