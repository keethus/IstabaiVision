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

    public function delete(Device $device)
    {
        $device->delete();

        return response()->json(null, 204);
    }
}
