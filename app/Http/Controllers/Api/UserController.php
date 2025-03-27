<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Requests\UpdateUserPasswordRequest;
use App\Models\Category;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        
        // for debug purpose
        // \Log::info('Updating user:', ['user_id' => $user->id, 'data' => $data]);
        $user->update($data);

        
        return response()->json(['message' => 'User updated successfully.'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
        $user->delete();
        return response('', 204);
    }


    public function updatePassword(UpdateUserPasswordRequest $request)
    {
        /** @var User $user */
        $user = Auth::user();

        // Manually check current password, since we want to validate against the stored password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'errors' => [
                    'currentPassword' => ['Current password is incorrect.']
                ]
            ], 422);
        }

        // Update the user's password
        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json(['message' => 'Password updated successfully.'], 200);
    }




    

}
