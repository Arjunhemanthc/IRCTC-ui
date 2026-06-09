const fs = require('fs');
const http = require('http');

async function test() {
    try {
        const loginPayload = JSON.stringify({ UsernameOrEmail: "admin@irctc.com", password: "Admin@123" });
        const loginRes = await fetch("http://localhost:5271/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: loginPayload
        });
        
        if (!loginRes.ok) {
            console.log("Login failed", await loginRes.text());
            return;
        }
        const authData = await loginRes.json();
        const token = authData.token;

        const stationPayload = JSON.stringify({
            stationCode: "TEST",
            stationName: "Test Station",
            city: "Test City",
            state: "Test State"
        });

        const stationRes = await fetch("http://localhost:5271/api/admin/trains/stations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: stationPayload
        });

        console.log("Status:", stationRes.status);
        console.log("Response:", await stationRes.text());
    } catch (e) {
        console.error(e);
    }
}
test();
