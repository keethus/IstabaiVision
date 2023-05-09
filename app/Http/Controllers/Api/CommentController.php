<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\PersonalAccessToken;

class CommentController extends Controller
{

    function index()
    {
        return response()->json(Comment::all(), 201);
    }

    function show($room_id)
    {
        $room = Room::where('room_id', $room_id)->first();
        $comments = Comment::where('commentable_id', $room->id)->get();

        if (!$comments) {
            return response()->json([], 201);
        }


        $commentData = [];
        foreach ($comments as $comment) {
            $user = User::where('id', $comment->user_id)->first();

            $commentData[] = [
                'id' => $comment->id,
                'body' => $comment->body,
                'created_at' => $comment->created_at,
                'user' => $user,
            ];
        }

        return response()->json($commentData, 201);
    }








    public function store(Request $request)
    {

        $room = Room::firstOrCreate([
            'name' => $request->name,
            'room_id' => $request->room_id,
            //room type
        ]);

        $comment = Comment::create([
            'commentable_id' => $room->id,
            'commentable_type' => 'App\Models\Room',
            'user_id' => $request->user_id,
            'body' => $request->body,
        ]);
        return response()->json([$comment], 201);

    }

    function update(Request $request, Comment $comment)
    {
        $comment->update($request->all());
        return response()->json($comment, 200);
    }

}
