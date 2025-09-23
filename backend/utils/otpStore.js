const otpMap = new Map();

const otpStore = {
    set: (email, otp) => {
        const expiry = Date.now() + 5 * 60 * 1000;
        otpMap.set(email, { otp, expiry });
    },

    getAndVerify: (email, otp) => {
        const storedData = otpMap.get(email);
        if (!storedData) return false;

        const { otp: storedOtp, expiry } = storedData;

        if (Date.now() > expiry || storedOtp !== otp) {
            otpMap.delete(email);
            return false;
        }
        return true;
    },

    delete: (email) => {
        otpMap.delete(email);
    }
};

module.exports = otpStore;
