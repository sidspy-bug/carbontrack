const http = require("http");

function request(url, method, headers, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: method,
            headers: {
                "Content-Type": "application/json",
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let body = "";
            res.on("data", (chunk) => body += chunk);
            res.on("end", () => {
                try {
                    resolve({
                        statusCode: res.statusCode,
                        body: JSON.parse(body)
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        body: body
                    });
                }
            });
        });

        req.on("error", (err) => reject(err));
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function run() {
    try {
        const rand = Math.floor(Math.random() * 1000000);
        const email = `testuser_${rand}@example.com`;
        const password = "Password@123";
        const fullName = "Test User";

        console.log("1. Registering user:", email);
        const regRes = await request("http://localhost:5000/api/auth/register", "POST", {}, {
            fullName,
            email,
            password
        });
        console.log("Register response:", regRes);

        console.log("2. Logging in...");
        const loginRes = await request("http://localhost:5000/api/auth/login", "POST", {}, {
            email,
            password
        });
        console.log("Login response:", loginRes);

        if (!loginRes.body.success) {
            throw new Error("Login failed");
        }

        const token = loginRes.body.token;

        console.log("3. Adding carbon entry...");
        const entryRes = await request("http://localhost:5000/api/carbon/add", "POST", {
            "Authorization": `Bearer ${token}`
        }, {
            transportCar: 10,
            transportBus: 5,
            electricity: 50,
            food: 3
        });
        console.log("Add entry response:", entryRes);

        if (entryRes.body.success) {
            console.log("✅ API integration test passed successfully!");
            process.exit(0);
        } else {
            console.log("❌ API integration test failed.");
            process.exit(1);
        }
    } catch (e) {
        console.error("Test execution failed:", e);
        process.exit(1);
    }
}

run();
