import userModel from "../models/usermodel.js";

export const getUserData = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await userModel.findById(id);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                name: user.name,
                accVerified: user.accVerified
            }
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}