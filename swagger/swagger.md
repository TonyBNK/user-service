
# Swagger Specification

```yaml
{
  "openapi": "3.0.0",
  "paths": {
    "/api/v1/auth/registration": {
      "post": {
        "operationId": "AuthController_registerUser",
        "summary": "Registration in the system",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserDto"
              }
            }
          }
        },
        "responses": {
          "204": {
            "description": "Input data is accepted. User created"
          },
          "400": {
            "description": "If the inputModel has incorrect values (in particular if the user with the given email or login already exists)",
            "example": {
              "errorsMessages": [
                {
                  "message": "string",
                  "field": "string"
                }
              ]
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResult"
                },
                "example": {
                  "errorsMessages": [
                    {
                      "message": "string",
                      "field": "string"
                    }
                  ]
                }
              }
            }
          }
        },
        "tags": [
          "Auth"
        ]
      }
    },
    "/api/v1/auth/login": {
      "post": {
        "operationId": "AuthController_login",
        "summary": "Login user to the system",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/LoginInputDto"
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Returns JWT accessToken (expired after 10 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 minutes)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginViewModel"
                }
              }
            }
          },
          "400": {
            "description": "If the inputModel has incorrect values",
            "example": {
              "errorsMessages": [
                {
                  "message": "string",
                  "field": "string"
                }
              ]
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResult"
                },
                "example": {
                  "errorsMessages": [
                    {
                      "message": "string",
                      "field": "string"
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "description": "If the password or login is wrong"
          }
        },
        "tags": [
          "Auth"
        ]
      }
    },
    "/api/v1/auth/refresh-token": {
      "post": {
        "operationId": "AuthController_refreshToken",
        "summary": "Generate new pair of access and refresh tokens (in cookie client must send correct refreshToken that will be revoked after refreshing)",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Returns JWT accessToken (expired after 10 minutes) in body and JWT refreshToken in cookie (http-only, secure) (expired after 20 minutes)",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginViewModel"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "tags": [
          "Auth"
        ]
      }
    },
    "/api/v1/auth/me": {
      "get": {
        "operationId": "AuthController_authMe",
        "summary": "Get information about current user",
        "parameters": [],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/MeViewModel"
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "tags": [
          "Auth"
        ]
      }
    },
    "/api/v1/auth/logout": {
      "post": {
        "operationId": "AuthController_logout",
        "summary": "Logout user from the system. In cookie client must send correct refreshToken that will be revoked",
        "parameters": [],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "tags": [
          "Auth"
        ]
      }
    },
    "/api/v1/users": {
      "get": {
        "operationId": "UsersController_getUsers",
        "summary": "Return all users",
        "parameters": [
          {
            "name": "searchLoginTerm",
            "required": false,
            "in": "query",
            "description": "Search term for user Login: Login should contains this term in any position",
            "schema": {
              "default": null,
              "type": "string"
            }
          },
          {
            "name": "sortBy",
            "required": false,
            "in": "query",
            "schema": {
              "default": "createdAt",
              "type": "string"
            }
          },
          {
            "name": "sortDirection",
            "required": false,
            "in": "query",
            "schema": {
              "default": "desc",
              "enum": [
                "asc",
                "desc"
              ],
              "type": "string"
            }
          },
          {
            "name": "pageNumber",
            "required": false,
            "in": "query",
            "description": "pageNumber is number of portions that should be returned",
            "schema": {
              "default": 1,
              "type": "integer"
            }
          },
          {
            "name": "pageSize",
            "required": false,
            "in": "query",
            "description": "pageSize is portions size that should be returned",
            "schema": {
              "default": 10,
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/Paginator"
                    },
                    {
                      "properties": {
                        "items": {
                          "type": "array",
                          "items": {
                            "$ref": "#/components/schemas/UserViewModel"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "If the inputModel has incorrect values"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "tags": [
          "Users"
        ],
        "security": [
          {
            "bearer": []
          }
        ]
      }
    },
    "/api/v1/sa/users": {
      "post": {
        "operationId": "UsersControllerSA_createUser",
        "summary": "Add new user to the system",
        "parameters": [],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/CreateUserDto"
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Returns the newly created user",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserViewModel"
                }
              }
            }
          },
          "400": {
            "description": "If the inputModel has incorrect values",
            "example": {
              "errorsMessages": [
                {
                  "message": "string",
                  "field": "string"
                }
              ]
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResult"
                },
                "example": {
                  "errorsMessages": [
                    {
                      "message": "string",
                      "field": "string"
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "tags": [
          "Users (Super Admin)"
        ],
        "security": [
          {
            "basic": []
          }
        ]
      },
      "get": {
        "operationId": "UsersControllerSA_getUsers",
        "summary": "Return all users",
        "parameters": [
          {
            "name": "searchLoginTerm",
            "required": false,
            "in": "query",
            "description": "Search term for user Login: Login should contains this term in any position",
            "schema": {
              "default": null,
              "type": "string"
            }
          },
          {
            "name": "sortBy",
            "required": false,
            "in": "query",
            "schema": {
              "default": "createdAt",
              "type": "string"
            }
          },
          {
            "name": "sortDirection",
            "required": false,
            "in": "query",
            "schema": {
              "default": "desc",
              "enum": [
                "asc",
                "desc"
              ],
              "type": "string"
            }
          },
          {
            "name": "pageNumber",
            "required": false,
            "in": "query",
            "description": "pageNumber is number of portions that should be returned",
            "schema": {
              "default": 1,
              "type": "integer"
            }
          },
          {
            "name": "pageSize",
            "required": false,
            "in": "query",
            "description": "pageSize is portions size that should be returned",
            "schema": {
              "default": 10,
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "allOf": [
                    {
                      "$ref": "#/components/schemas/Paginator"
                    },
                    {
                      "properties": {
                        "items": {
                          "type": "array",
                          "items": {
                            "$ref": "#/components/schemas/UserViewModel"
                          }
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          "400": {
            "description": "If the inputModel has incorrect values"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "tags": [
          "Users (Super Admin)"
        ],
        "security": [
          {
            "basic": []
          }
        ]
      }
    },
    "/api/v1/sa/users/{id}": {
      "put": {
        "operationId": "UsersControllerSA_updateUser",
        "summary": "Update user specified by id",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "$ref": "#/components/schemas/UpdateUserDto"
              }
            }
          }
        },
        "responses": {
          "204": {
            "description": "No Content"
          },
          "400": {
            "description": "If the inputModel has incorrect values",
            "example": {
              "errorsMessages": [
                {
                  "message": "string",
                  "field": "string"
                }
              ]
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ErrorResult"
                },
                "example": {
                  "errorsMessages": [
                    {
                      "message": "string",
                      "field": "string"
                    }
                  ]
                }
              }
            }
          },
          "401": {
            "description": "Unauthorized"
          },
          "404": {
            "description": "Not Found"
          }
        },
        "tags": [
          "Users (Super Admin)"
        ],
        "security": [
          {
            "basic": []
          }
        ]
      },
      "delete": {
        "operationId": "UsersControllerSA_deleteUser",
        "summary": "Delete user specified by id",
        "parameters": [
          {
            "name": "id",
            "required": true,
            "in": "path",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "204": {
            "description": "No Content"
          },
          "401": {
            "description": "Unauthorized"
          }
        },
        "tags": [
          "Users (Super Admin)"
        ],
        "security": [
          {
            "basic": []
          }
        ]
      }
    },
    "/api/v1/testing/all-data": {
      "delete": {
        "operationId": "TestingController_deleteAllData",
        "summary": "Clear database: delete all data from all tables",
        "parameters": [],
        "responses": {
          "204": {
            "description": "All data is deleted"
          }
        },
        "tags": [
          "Testing"
        ]
      }
    }
  },
  "info": {
    "title": "User service API",
    "description": "User service API",
    "version": "1.0",
    "contact": {}
  },
  "tags": [],
  "servers": [],
  "components": {
    "securitySchemes": {
      "bearer": {
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": "Enter JWT Bearer token only",
        "type": "http"
      },
      "basic": {
        "type": "http",
        "scheme": "basic"
      },
      "refreshToken": {
        "type": "apiKey",
        "in": "cookie",
        "name": "refreshToken",
        "description": "JWT refreshToken inside cookie. Must be correct, and must not expire"
      }
    },
    "schemas": {
      "CreateUserDto": {
        "type": "object",
        "properties": {
          "login": {
            "type": "string",
            "description": "Performs user's login",
            "minimum": 3,
            "maximum": 10
          },
          "email": {
            "type": "string",
            "description": "Performs user's email"
          },
          "password": {
            "type": "string",
            "description": "Performs user's password",
            "minimum": 6,
            "maximum": 20
          },
          "age": {
            "type": "integer",
            "description": "Performs the age of user",
            "minimum": 1,
            "maximum": 100
          },
          "biography": {
            "type": "string",
            "description": "Performs user's biography",
            "minimum": 1,
            "maximum": 1000
          }
        },
        "required": [
          "login",
          "email",
          "password",
          "age",
          "biography"
        ]
      },
      "FieldError": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "nullable": true,
            "description": "Message with error explanation for certain field"
          },
          "field": {
            "type": "string",
            "nullable": true,
            "description": "What field/property of input model has error"
          }
        },
        "required": [
          "message",
          "field"
        ]
      },
      "ErrorResult": {
        "type": "object",
        "properties": {
          "errorsMessages": {
            "nullable": true,
            "type": "array",
            "items": {
              "$ref": "#/components/schemas/FieldError"
            }
          }
        },
        "required": [
          "errorsMessages"
        ]
      },
      "LoginInputDto": {
        "type": "object",
        "properties": {
          "loginOrEmail": {
            "type": "string"
          },
          "password": {
            "type": "string"
          }
        },
        "required": [
          "loginOrEmail",
          "password"
        ]
      },
      "LoginViewModel": {
        "type": "object",
        "properties": {
          "accessToken": {
            "type": "string",
            "description": "JWT access token"
          }
        },
        "required": [
          "accessToken"
        ]
      },
      "MeViewModel": {
        "type": "object",
        "properties": {
          "userId": {
            "type": "string"
          },
          "login": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "age": {
            "type": "integer"
          },
          "biography": {
            "type": "string"
          }
        },
        "required": [
          "userId",
          "login",
          "email",
          "age",
          "biography"
        ]
      },
      "Paginator": {
        "type": "object",
        "properties": {
          "items": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "pagesCount": {
            "type": "integer"
          },
          "page": {
            "type": "integer"
          },
          "pageSize": {
            "type": "integer"
          },
          "totalCount": {
            "type": "integer"
          }
        },
        "required": [
          "items",
          "pagesCount",
          "page",
          "pageSize",
          "totalCount"
        ]
      },
      "UserViewModel": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "login": {
            "type": "string"
          },
          "email": {
            "type": "string"
          },
          "age": {
            "type": "integer"
          },
          "biography": {
            "type": "string"
          },
          "createdAt": {
            "format": "date-time",
            "type": "string"
          }
        },
        "required": [
          "id",
          "login",
          "email",
          "age",
          "biography",
          "createdAt"
        ]
      },
      "UpdateUserDto": {
        "type": "object",
        "properties": {
          "password": {
            "type": "string",
            "description": "Performs user's password",
            "minimum": 6,
            "maximum": 20
          },
          "age": {
            "type": "integer",
            "description": "Performs the age of user",
            "minimum": 1,
            "maximum": 100
          },
          "biography": {
            "type": "string",
            "description": "Performs user's biography",
            "minimum": 1,
            "maximum": 1000
          }
        },
        "required": [
          "password",
          "age",
          "biography"
        ]
      }
    }
  }
}
```
