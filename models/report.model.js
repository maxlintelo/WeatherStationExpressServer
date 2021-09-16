module.exports = mongoose => {
    const Report = mongoose.model(
        "report",
        mongoose.Schema(
            {
                temperature: String,
                humidity: String,
            },
            {
                timestamps: true,
            }
        )
    );
    return Report;
};
