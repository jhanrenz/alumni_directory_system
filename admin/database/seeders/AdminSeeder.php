<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'PSU-AC Admin',
            'course_id' => 1,
            'year' => 'N/A',
            'role' => 'admin',
            'image' => null,
            'verify' => 'approved',
            'email' => 'psu-ac@psu.edu.ph',
            'password' => Hash::make('psu-asin-123'),
        ]);
    }
}
