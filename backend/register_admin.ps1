$body = @{
    email = "admin@amazonclone.com"
    password = "Admin@123"
    confirmPassword = "Admin@123"
    firstName = "Admin"
    lastName = "User"
    role = "ADMIN"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method Post -Body $body -ContentType "application/json"
