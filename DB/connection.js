import mongoose from "mongoose"

const db_connection = async () =>
{
    await mongoose.connect(process.env.CONNECTION_URL)
    .then((res) => console.log('DB connected successfully'))
    .catch((err) => console.log('DB connection failed', err))
}

export default db_connection