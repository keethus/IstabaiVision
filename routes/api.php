<?php

use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DeviceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/device/store', [DeviceController::class, 'store']);
Route::get('/devices', [DeviceController::class, 'index']);
Route::get('/devices/{floor}', [DeviceController::class, 'index']);
Route::delete('/devices/{floor}', [DeviceController::class, 'deleteFromFloor']);

Route::get('/device/{device}', [DeviceController::class, 'show']);
Route::delete('/device/{id}', [DeviceController::class, 'delete']);

Route::get('/comments', [CommentController::class, 'index']);
Route::get('/comments/{room}', [CommentController::class, 'show']);
Route::post('/comments', [CommentController::class, 'store']);