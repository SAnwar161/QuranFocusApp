/**
 * AI-powered reflection question generator
 * Primary: Groq API, Fallback 1: Hugging Face, Fallback 2: Theme-based
 */

// Load API keys from environment variables (.env file)
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY || '';
const HF_API_KEY = process.env.EXPO_PUBLIC_HF_API_KEY || '';

/**
 * Generate reflection question using Groq API
 */
const tryGroqAPI = async (translation) => {
    try {
        const requestBody = {
            messages: [{
                role: 'system',
                content: 'You are a thoughtful Islamic scholar helping Muslims reflect on Quranic verses. Generate personal, thought-provoking questions.'
            }, {
                role: 'user',
                content: `Based on this Quran verse translation: "${translation}"

Generate ONE powerful, personal reflection question that:
- Is directly related to THIS specific verse's message
- Encourages deep self-reflection
- Starts with "Do you...", "How often...", "When was the last time...", or similar
- Relates to daily life and actions
- Maximum 15 words
- Must be unique to this verse's meaning

Return ONLY the question, nothing else.`
            }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 100
        };

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Groq API Error Details:', JSON.stringify(data, null, 2));
            throw new Error(`Groq API returned ${response.status}: ${data.error?.message || 'Unknown error'}`);
        }

        if (data.choices?.[0]?.message?.content) {
            const question = data.choices[0].message.content.trim();
            console.log('✅ Groq AI Reflection:', question);
            return question;
        }

        throw new Error('Invalid response format');

    } catch (error) {
        console.error('❌ Groq API Error:', error.message);
        return null;
    }
};

/**
 * Generate reflection question using Hugging Face API
 */
const tryHuggingFaceAPI = async (translation) => {
    try {
        const prompt = `You are a thoughtful Islamic scholar. Based on this Quran verse: "${translation}"

Generate ONE powerful reflection question (max 15 words) that encourages self-reflection and relates to daily life. Start with "Do you...", "How often...", or "When was the last time...". Return ONLY the question.`;

        const response = await fetch('https://router.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    return_full_text: false
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('HF API Error Details:', JSON.stringify(data, null, 2));
            throw new Error(`HF API returned ${response.status}`);
        }

        if (data[0]?.generated_text) {
            const question = data[0].generated_text.trim();
            console.log('✅ Hugging Face AI Reflection:', question);
            return question;
        }

        throw new Error('Invalid response format');

    } catch (error) {
        console.error('❌ Hugging Face API Error:', error.message);
        return null;
    }
};

/**
 * Comprehensive theme-based fallback (100+ patterns)
 */
const getThemeBasedQuestion = (translation) => {
    const text = translation.toLowerCase();

    // ==== FAITH & BELIEF ====
    if (text.includes('believe') && text.includes('unseen')) return "Do you believe in what you cannot see as strongly as what you can?";
    if (text.includes('believe') && text.includes('heart')) return "Does your heart truly believe what your tongue declares?";
    if (text.includes('faith') && text.includes('increase')) return "What are you doing to strengthen your faith today?";
    if (text.includes('faith') && text.includes('test')) return "Does hardship weaken or strengthen your faith?";
    if (text.includes('doubt') || text.includes('uncertain')) return "When doubt creeps in, do you seek knowledge or turn away?";
    if (text.includes('believe') && text.includes('act')) return "Do your actions reflect the faith you profess?";
    if (text.includes('trust') && text.includes('allah')) return "Do you trust Allah's plan even when you don't understand it?";
    if (text.includes('certainty') || text.includes('certain')) return "How certain are you of Allah's promises?";
    if (text.includes('believe') && text.includes('messenger')) return "Do you follow the Prophet's example in your daily life?";
    if (text.includes('believe') || text.includes('faith')) return "When did you last renew your faith intentionally?";

    // ==== WORSHIP & PRAYER ====
    if (text.includes('prayer') && text.includes('time')) return "Do you pray at the earliest time or delay until the last moment?";
    if (text.includes('prayer') && text.includes('establish')) return "Have you truly established prayer or just perform it habitually?";
    if (text.includes('pray') && text.includes('humble')) return "Do you humble yourself completely in prayer?";
    if (text.includes('pray') && (text.includes('focus') || text.includes('mind'))) return "Are you present with Allah in your prayers?";
    if (text.includes('mosque') || text.includes('masjid')) return "When did you last pray in congregation at the mosque?";
    if (text.includes('pray') && text.includes('night')) return "Do you wake for night prayer to speak with Allah?";
    if (text.includes('worship') && (text.includes('alone') || text.includes('secret'))) return "Do you worship Allah in private as you do in public?";
    if (text.includes('worship') && text.includes('sincere')) return "Is your worship for Allah alone or for people's approval?";
    if (text.includes('bow') || text.includes('prostrate')) return "Do you feel the humility of prostration before Allah?";
    if (text.includes('stand') && text.includes('prayer')) return "Do you stand before Allah with full awareness?";
    if (text.includes('fast') || text.includes('fasting')) return "Do you fast only from food or also from bad deeds?";
    if (text.includes('hajj') || text.includes('pilgrimage')) return "Are you preparing spiritually for the journey to His House?";
    if (text.includes('zakat') || text.includes('zakah')) return "Do you purify your wealth with sincere zakah?";
    if (text.includes('prayer') || text.includes('pray')) return "Are you fully present in your five daily prayers?";
    if (text.includes('worship')) return "Do you see all of life as worship of Allah?";

    // ==== PATIENCE & PERSEVERANCE ====
    if (text.includes('patient') && text.includes('trial')) return "Do you remain patient when tested, trusting Allah's wisdom?";
    if (text.includes('patient') && text.includes('hardship')) return "Does hardship draw you closer to Allah or push you away?";
    if (text.includes('patient') && text.includes('reward')) return "Do you remember that patience brings immense reward?";
    if (text.includes('steadfast') || text.includes('persever')) return "How firm are you when challenged in your faith?";
    if (text.includes('patient') && text.includes('injust')) return "Can you be patient even when treated unfairly?";
    if (text.includes('patient') && text.includes('tongue')) return "Do you control your tongue when provoked?";
    if (text.includes('endure') || text.includes('bear')) return "What burdens are you bearing with patience for Allah?";
    if (text.includes('rush') || text.includes('haste')) return "Do you rush when Allah asks you to be patient?";
    if (text.includes('wait')) return "Can you wait peacefully for Allah's perfect timing?";
    if (text.includes('patient') || text.includes('patience')) return "How often do you practice patience in daily challenges?";

    // ==== GRATITUDE ====
    if (text.includes('grateful') && text.includes('bless')) return "How many of Allah's blessings did you acknowledge today?";
    if (text.includes('grateful') && text.includes('increase')) return "Do you thank Allah knowing He will increase you?";
    if (text.includes('thank') && text.includes('hardship')) return "Can you thank Allah even in difficult times?";
    if (text.includes('ungrateful') || text.includes('ingratitude')) return "How often do you complain instead of being grateful?";
    if (text.includes('favor') || text.includes('bounty')) return "Have you counted your blessings from Allah today?";
    if (text.includes('grateful') || text.includes('thank')) return "When was the last time you thanked Allah sincerely?";
    if (text.includes('bless')) return "Can you see Allah's blessings in everything around you?";

    // ==== FORGIVENESS ====
    if (text.includes('forgiv') && text.includes('sin')) return "Have you sought forgiveness for today's shortcomings?";
    if (text.includes('forgiv') && text.includes('repent')) return "Do you sincerely repent or just say words?";
    if (text.includes('forgiv') && text.includes('others')) return "Do you forgive others as you want Allah to forgive you?";
    if (text.includes('pardon') || text.includes('overlook')) return "Can you pardon those who wrong you?";
    if (text.includes('turn') && text.includes('allah')) return "When you sin, how quickly do you turn back to Allah?";
    if (text.includes('regret') || text.includes('remorse')) return "Does your heart truly regret your sins?";
    if (text.includes('forgiv')) return "Who do you need to forgive in your heart today?";
    if (text.includes('repent')) return "Is your repentance sincere with no intention to return to sin?";

    // ==== PARENTS & FAMILY ====
    if (text.includes('parent') && text.includes('kind')) return "Do you speak to your parents with the utmost kindness?";
    if (text.includes('parent') && (text.includes('old') || text.includes('age'))) return "Are you caring for your aging parents with patience?";
    if (text.includes('mother')) return "When did you last honor your mother's sacrifices?";
    if (text.includes('father')) return "Do you obey your father in all that is good?";
    if (text.includes('family') || text.includes('kin')) return "Are you maintaining ties with all your relatives?";
    if (text.includes('orphan')) return "How do you treat orphans with mercy and justice?";
    if (text.includes('parent')) return "When did you last honor your parents with your actions?";

    // ==== CHARITY & SPENDING ====
    if (text.includes('spend') && text.includes('love')) return "Do you give from what you love or only what you don't need?";
    if (text.includes('spend') && text.includes('secret')) return "Do you give charity in secret to please only Allah?";
    if (text.includes('poor') || text.includes('needy')) return "When did you last help someone less fortunate?";
    if (text.includes('wealth') && text.includes('test')) return "Do you see your wealth as a test or a blessing?";
    if (text.includes('spend') || text.includes('charity') || text.includes('give')) return "When did you last give for Allah's sake?";
    if (text.includes('wealth')) return "Is your wealth making you closer or further from Allah?";

    // ==== TRUTH & HONESTY ====
    if (text.includes('truth') && text.includes('stand')) return "Do you stand for truth even when it's against you?";
    if (text.includes('truth') && (text.includes('difficult') || text.includes('hard'))) return "Do you speak truth even when it costs you?";
    if (text.includes('lie') || text.includes('false')) return "Have you avoided all forms of lying today?";
    if (text.includes('testimony') || text.includes('witness')) return "Would you bear true witness even for or against loved ones?";
    if (text.includes('deceive') || text.includes('cheat')) return "Do you deceive anyone in thought, word, or deed?";
    if (text.includes('truth') || text.includes('honest')) return "Did you speak the truth today even when it was difficult?";

    // ==== JUSTICE ====
    if (text.includes('just') && (text.includes('enemy') || text.includes('hate'))) return "Are you just even toward those you dislike?";
    if (text.includes('oppres') || text.includes('wrong')) return "Do you oppose oppression in all its forms?";
    if (text.includes('just') || text.includes('justice')) return "Do you stand for justice even when it goes against your interest?";

    // ==== REMEMBRANCE ====
    if (text.includes('remember') && (text.includes('morning') || text.includes('evening'))) return "Do you remember Allah at dawn and dusk daily?";
    if (text.includes('remember') && text.includes('much')) return "Is your tongue moist with Allah's remembrance?";
    if (text.includes('forget') && text.includes('allah')) return "What makes you forget Allah during your day?";
    if (text.includes('remember') && text.includes('allah')) return "How often do you remember Allah in your daily moments?";
    if (text.includes('remember')) return "Does your tongue frequently remember the name of Allah?";

    // ==== FEAR & HOPE ====
    if (text.includes('fear') && text.includes('allah') && text.includes('secret')) return "Does fear of Allah guard you in private moments?";
    if (text.includes('hope') && text.includes('mercy')) return "Do you balance hope in His mercy with fear of His justice?";
    if (text.includes('fear') && text.includes('allah')) return "Do you fear Allah even when no one is watching?";
    if (text.includes('hope')) return "Do you hope in Allah's mercy while striving to please Him?";
    if (text.includes('fear')) return "Does fear of Allah guide all your choices?";

    // ==== DEATH & HEREAFTER ====
    if (text.includes('death') && text.includes('ready')) return "If today were your last, would you be ready to meet Allah?";
    if (text.includes('grave') || text.includes('tomb')) return "Are you preparing for what awaits in the grave?";
    if (text.includes('hereafter') && text.includes('world')) return "Do you work more for this life or the next?";
    if (text.includes('judgment') || text.includes('account')) return "How will you answer Allah on the Day of Judgment?";
    if (text.includes('paradise') || text.includes('garden')) return "What are you doing today to earn Paradise?";
    if (text.includes('hell') || text.includes('fire')) return "Do you fear Hellfire enough to avoid its causes?";
    if (text.includes('death') || text.includes('die')) return "Do you live as if you will meet Allah tomorrow?";

    // ==== GUIDANCE ====
    if (text.includes('guid') && text.includes('path')) return "Are you walking on the straight path or straying?";
    if (text.includes('misguide') || text.includes('astray')) return "What might be leading you away from Allah's path?";
    if (text.includes('knowledge') && text.includes('act')) return "Do you act upon the knowledge you have?";
    if (text.includes('learn') || text.includes('teach')) return "What did you learn about your faith today?";
    if (text.includes('wisdom')) return "Do you seek wisdom or just information?";
    if (text.includes('guid')) return "Have you asked Allah for guidance today?";

    // ==== ADDITIONAL THEMES ====
    if (text.includes('mercy') || text.includes('merciful')) return "How merciful are you to those who wrong you?";
    if (text.includes('compassion') || text.includes('kind')) return "Do you show compassion to all of Allah's creation?";
    if (text.includes('anger') || text.includes('rage')) return "Can you control your anger for Allah's sake?";
    if (text.includes('envy') || text.includes('jealous')) return "Have you purified your heart from envy?";
    if (text.includes('pride') || text.includes('arrogant')) return "Does pride ever keep you from accepting truth?";
    if (text.includes('humble') || text.includes('humility')) return "Do you humble yourself before Allah and His creation?";
    if (text.includes('covenant') || text.includes('promise')) return "Do you fulfill your promises as Allah fulfills His?";
    if (text.includes('backbit') || text.includes('gossip')) return "Have you guarded your tongue from backbiting?";
    if (text.includes('slander')) return "Do you protect others' honor with your speech?";
    if (text.includes('modesty') || text.includes('chastity')) return "Do you guard your modesty in all situations?";
    if (text.includes('tongue') || text.includes('speech')) return "Do you control your tongue from harmful speech?";

    // Default
    return "How will you apply this teaching in your daily life?";
};

/**
 * Main function: Three-tier fallback system
 */
export const generateReflectionQuestion = async (arabicText, translation) => {
    // Try Groq API (Primary)
    const groqResult = await tryGroqAPI(translation);
    if (groqResult) return groqResult;

    // Try Hugging Face API (Fallback 1)
    const hfResult = await tryHuggingFaceAPI(translation);
    if (hfResult) return hfResult;

    // Use theme-based patterns (Fallback 2)
    console.log('💭 Using theme-based reflection');
    return getThemeBasedQuestion(translation);
};
