import redis, json, uuid, re

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

def CreateOrder(rConn: redis.Redis, orderObject: Order, OID: str):
    try:
        rConn.hmset(OID, orderObject.model_dump_json())
        rConn.rpush(f"UID:{orderObject.UID}:orders", OID)

        return {
            'success': True,
            'message': f'{OID} created Successfully',
            'orderID': f'{OID}'
        }
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

def ProcessBasketToOrder(BID: str):
    try:
        redisOID = f"Order_{(uuid.uuid4()).__str__().replace('-', '_')}"
        redisBID = f"Basket_{BID.__str__().replace('-', '_')}"  # Concatenate for Redis

        rConn = redis.Redis(connection_pool=rConnPool, decode_responses=True) # Connect to Redis Database
    
        retrieved_data = json.loads(rConn.get(redisBID))

        userID = retrieved_data["BID"]
        items = retrieved_data["Items"]
        total_price = retrieved_data["TotalPrice"]

        regexPatternBID = r'^(Order_|Basket_)(\w+)$'
        userid = re.sub(regexPatternBID, r'\2', userID)

        order = Order(
            UID=f'{userid}',
            Items=items,
            FinalPrice=total_price
        )

        return CreateOrder(rConn, order, redisOID)  # Calls to the Creation Script
            
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

def FetchOrderbyID(OID: str):
    try:
        redisOID = f"Order_{OID.__str__().replace('-', '_')}"
        rConn = redis.Redis(connection_pool=rConnPool, decode_responses=True) # Connect to Redis Database

        retrieved_Data = json.loads(rConn.get(redisOID))

        return {
            'success': True,
            'message': f'{redisOID} fetched Successfully',
            'order': retrieved_Data
        }
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

def FetchOrdersOfUser(UID: str):
    try:
        redisUID = UID.__str__().replace('-', '_')
        rConn = redis.Redis(connection_pool=rConnPool, decode_responses=True) # Connect to Redis Database

        order_ids = rConn.smembers(f"UID:{redisUID}:orders")

        orders = []
        for order_id in order_ids:
            # Retrieve Order Objects then Append them to the Empty List
            order = rConn.hgetall(order_id)
            orders.append(order)

        return {
            'success': True,
            'message': f'Orders for User {UID} fetched Successfully',
            'orders': orders
        }
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

