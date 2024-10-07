import redis, json, uuid, re

from models.apimodels import Order, AddressInfo, FlowerOrder

rConnPool = redis.ConnectionPool(host='CloverpatchBasketAndOrderDatabase', port=6379)

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


def CreateFlowerOrder(BID: str, addressInfo: AddressInfo):
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

        orderObject = FlowerOrder(
            userID=userid,
            Items=items,
            FinalPrice=total_price,
            AddressInfo=addressInfo
        )

        rConn.hmset(redisOID, orderObject.model_dump_json())
        rConn.rpush(f"UID:{orderObject.UID}:orders", redisOID)

        return {
            'success': True,
            'message': f'{redisOID} created Successfully',
            'orderID': f'{redisOID}'
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


def CreateCafeOrder(rConn: redis.Redis, orderObject: Order, OID: str):
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

        return CreateCafeOrder(rConn, order, redisOID)  # Calls to the Creation Script
            
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


def CancelOrder(OID: str, UID: str):
    try:
        OID = OID.__str__().replace('-', '_')
        redisOID = f"Order_{OID}"

        rConn = redis.Redis(connection_pool=rConnPool)  # Connect to Redis Database

        # Delete Order object from both the Order Items and the List of User's Orders
        rConn.delete(f'{redisOID}:Items')
        rConn.srem(f'UID:{UID}:orders', redisOID)

        return {
            "success" : True,
            "message" : f"Successful Deletion of {redisOID}"
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