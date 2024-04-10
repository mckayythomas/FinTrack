import { NextRequest, NextResponse } from "next/server";
import { UserRepository } from "@/infrastructure/adapters/repositories/UserRepository";
import { getUserById } from "@/domain/useCases/users/getUserById";
import { auth } from "@/infrastructure/auth/nextAuth";

const userRepository = new UserRepository();
// GET users account
