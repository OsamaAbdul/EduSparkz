

// creating the rate limit to prevent spamming
const Attempt_Limit = 5; // user can only attempt 5 times
const Cooldown_Period = 5 * 60 * 1000; // after 15 mins it will cool down


// function to check the rate limit

export const checkRateLimit = (key) => {

    // getting the data from the local storage and adding the key e.g. rateLimit_login
    const data = localStorage.getItem(`rate_limit_${key}`);

    // if the data doesnt exist, allow the user
    if (!data) return {
        blocked: false,
        remainingTime: 0
    };

    // if user record exists, check if the coolddown has passed
    const { attempts, lastAttempt } = JSON.parse(data);
    // get the current time
    const now = Date.now();
    // calculate the time passed since the last attempt
    const timePassed = now - lastAttempt;

    // check if user has attempted 5 or more times and also how long it has been since the last attempt
    if (attempts >= Attempt_Limit && timePassed < Cooldown_Period) {
        // if the user is blocked, return the remaining
        return {
            blocked: true,
            remainingTime: Math.ceil((Cooldown_Period - timePassed) / 1000),
        }
    }

    // Reset if the cooldown has passed
    if (timePassed >= Cooldown_Period) {
        localStorage.removeItem(`rate_limit_${key}`);
        return {
            blocked: false,
            remainingTime: 0
        }
    }

    return {
        blocked: false,
        remainingTime: 0
    }
}
// keep tracks of all the attempts by the user

export const recordAttempt = (key) => {
    // get the current date
    const now = Date.now();
    const data = localStorage.getItem(`rate_limit_${key}`);

    // set the number of attempts to 1 if no data exists
    let attempts = 1;

    if (data) {
        const parsed = JSON.parse(data);
        // increment it
        attempts = parsed.attempts + 1;
    }

    // store the data in the local storage

    localStorage.setItem(
        `rate_limit_${key}`,
        JSON.stringify({ attempts, lastAttempt: now })
    );

};

// function to clear the rate limit

export const clearRateLimit = (key) => {
    localStorage.removeItem(`rate_limit_${key}`);
}