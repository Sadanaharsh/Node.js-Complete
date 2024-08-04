class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400    // api response hai isliye hum status code 400 se kam bhejenge.
    }
}

export { ApiResponse }