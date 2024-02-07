import RequestCount from '../models/totalReqModel.js';

export const updateRequestCount = (req, res, next) => {
    RequestCount.findOneAndUpdate({}, { $inc: { totalRequests: 1 } }, { upsert: true })
        .then(() => next())
        .catch(err => next(err));
};

export const getTotalRequests = (req, res) => {
    RequestCount.findOne({})
        .then(count => {
            res.status(200).json({
                "success": true,
                "total_Requests": count.totalRequests,
                "message": "🚀 Woohoo! Data successfully retrieved! Let's celebrate! 🎉",
                "details": {
                    "creator": "Nishmal 🌟",
                    "license": "🔓 Open Source - Free for All! 🌍",
                    "documentation": {
                        "description": "📚 Explore the API documentation to get started:",
                        "link": "https://its-me-nishmal.github.io/Flutter-Self-Stack-Api/#/"
                    },
                    "github_repo": {
                        "description": "💻 Dive deeper into the code! Check out my GitHub repository:",
                        "link": "https://github.com/Its-me-nishmal/Flutter-Self-Stack-Api"
                    },
                    "contact": {
                        "for_api_key": "💡 Want to unlock the API magic? Just drop me a message!",
                        "email": "📧 alltrackerx@gmail.com",
                        "whatsapp": "📲 +91-79941-07442"
                    },
                }
            });
        })
        .catch(err => {
            res.status(500).json({ "success": false, "message": "Error retrieving total requests" });
        });
};
