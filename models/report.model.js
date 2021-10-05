module.exports = mongoose => {
    const Report = mongoose.model(
        "report",
        mongoose.Schema(
            {
                temperature: String,
                humidity: String,
                pressure: String,
            },
            {
                timestamps: true,
            }
        )
    );
    return Report;
};
