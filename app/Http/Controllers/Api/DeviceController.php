<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    public function index(Request $request)
    {
        $floor = $request->floor;
        if($floor == null) {
            return response()->json(Device::all(), 201);
        }

        return response()->json(Device::where('floor', $floor)->get(), 201);
    }

    public function show(Device $device)
    {
        return $device;
    }

    public function store(Request $request)
    {
        $device = Device::create([
            'device_id' => $request->device_id,
            'longitude' => $request->longitude,
            'latitude' => $request->latitude,
            'floor' => $request->floor,
            'icon' => $request->icon,
        ]);


        return response()->json($device, 201);
    }

    public function update(Request $request, Device $device)
    {
        $device->update($request->all());

        return response()->json($device, 200);
    }

    public function delete(Request $request)
    {
        if(auth()) {
            if(!$request->id) {
                return response()->json('No id provided', 400);
            }

            Device::where('device_id', $request->id)->delete();
            return response()->json(null, 204);
        }

    }

    public function deleteFromFloor(Request $request)
    {
        $floor = $request->floor;
        if(is_null($floor)) {
            return response()->json('No floor provided', 400);
        }

        Device::where('floor', $floor)->delete();

        return response()->json('Devices successfully removed', 204);
    }
}
