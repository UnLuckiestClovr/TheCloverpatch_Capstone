import redis, json, uuid

from models.apimodels import Order, OrderItem

rConnPool = redis.ConnectionPool(host='CloverpatchBasketAndOrderDatabase', port=10002)

def check_OrderExists(OID: str):
    try:
        redisOID = f"Order_{OID.__str__().replace('-', '_')}"

        rConn = redis.Redis(connection_pool=rConnPool, decode_responses=True) # Connect to Redis Database
        ORDER_EXISTS = rConn.exists(redisOID)

        return (ORDER_EXISTS == 1)
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }

def MakeOrder(OID: str, order: Order):
    try:
        redisOID = f"Order_{OID.__str__().replace('-', '_')}"  # Concatenate for Redis

        rConn = redis.Redis(connection_pool=rConnPool, decode_responses=True) # Connect to Redis Database
    
        rConn.hmset(redisOID, order.model_dump_json())
    except redis.ConnectionError as e:
        return {
            "success": False,
            "message": f"Error connecting to Redis: {e}"
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"An error occurred: {e}"
        }