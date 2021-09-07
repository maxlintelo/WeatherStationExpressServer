module.exports = mongoose => {
    const Report = mongoose.model(
        "report",
        mongoose.Schema(
            {
                title: String,
                temperature: String,
                pressure: String,
            },
            {
                timestamps: true,
            }
        )
    );
  
    return Report;
};
