import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/user.models.js";
import dotenv from "dotenv";

dotenv.config();

// Configuración de la estrategia Local
passport.use("login", new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: "Usuario no encontrado" });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return done(null, false, { message: "Contraseña incorrecta" });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    },
));

// Configuración de la estrategia JWT
passport.use("jwt", new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([ExtractJwt.fromAuthHeaderAsBearerToken()]),
        secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);
            if (!user) return done(null, false, { message: "Usuario no encontrado" });
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    },
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

export default passport;