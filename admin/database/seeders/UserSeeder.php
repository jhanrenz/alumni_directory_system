<?php

namespace Database\Seeders;


use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'User Test',
            'course_id' => 1,
            'year' => 'N/A',
            'role' => 'user',
            'image' => null,
            'verify' => 'approved',
            'email' => 'user@psu.edu.ph',
            'password' => Hash::make('user1234'),
        ]);
    }
}
