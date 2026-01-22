<?php

namespace Pterodactyl\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Pterodactyl\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\View\View;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RegisterController extends AbstractRegisterController
{
    /**
     * Handle all incoming requests for the authentication routes and render the
     * base authentication view component. React will take over at this point and
     * turn the register area into an SPA.
     */
    public function index(): View
    {
        return view('templates/auth.core');
    }

    /**
     * Handle a register request to the application.
     *
     * @throws \Pterodactyl\Exceptions\DisplayException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function register(Request $request): JsonResponse
    {
		$request->validate([
			'email' => 'required|email',
			'username' => 'required|string',
			'firstname' => 'required|string',
			'lastname' => 'required|string',
			'password' => 'required|string|min:8',
		]);
		
        if ($this->hasTooManyLoginAttempts($request)) {
            $this->fireLockoutEvent($request);
            $this->sendLockoutResponse($request);
        }

        try {
            $user = User::where('email', $request->input('email'))->orWhere('username', $request->input('username'))->first();

            if ($user) {
                return response()->json(['error' => 'O nome de usuário ou email já está cadastrado.'], 400);
            }
        } catch (ModelNotFoundException) {
            $this->sendFailedRegisterResponse($request);
        }

        return $this->sendRegisterResponse($request);
    }
}