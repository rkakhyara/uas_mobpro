<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Create a simple token (in production, use Laravel Sanctum or Passport)
        $token = base64_encode($user->email . ':' . now()->timestamp);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    /**
     * Register user
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'sometimes|in:admin,responden',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = $validated['role'] ?? 'responden';

        $user = User::create($validated);

        // Create a simple token
        $token = base64_encode($user->email . ':' . now()->timestamp);

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
