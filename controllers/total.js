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
                "details": {
                  "creator": "Nishmal 🚀",
                  "license": "🔓 Free for All 🌍",
                  "contact": {
                    "for_api_key": "📩 Want to unlock the API magic? Drop me a message!"
                  }
                },
                "message": "✨ Data retrieved successfully! 🎉"
              }
              );
        })
        .catch(err => {
            res.status(500).json({ "success": false, "message": "Error retrieving total requests" });
        });
};
