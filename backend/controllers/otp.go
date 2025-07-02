package controllers

import (
  "fmt"
  "net/http"
  "io/ioutil"
  "ksale/backend/models"
)

func sendOTP(user models.User) {

  url := "https://2factor.in/API/V1/61865792-0728-11f0-8b17-0200cd936042/SMS/" + user.CountryCode + fmt.Sprintf("%d", user.Phone) + "/" + fmt.Sprintf("%d", user.OneTimePassword) + "/KSALEOTP"
  fmt.Println(url)
  method := "GET"

  client := &http.Client {
  }
  req, err := http.NewRequest(method, url, nil)

  if err != nil {
    fmt.Println(err)
    return
  }
  res, err := client.Do(req)
  if err != nil {
    fmt.Println(err)
    return
  }
  defer res.Body.Close()

  body, err := ioutil.ReadAll(res.Body)
  if err != nil {
    fmt.Println(err)
    return
  }
  fmt.Println(string(body))
}