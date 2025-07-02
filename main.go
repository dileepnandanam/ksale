package main

import (
  "ksale/backend"
  _ "github.com/joho/godotenv/autoload"
)

func main() {
  backend.RunHTTPServer()
}
