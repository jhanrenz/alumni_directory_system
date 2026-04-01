<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $courses = [
            'Initial Course'
        ];

        foreach ($courses as $courseName) {
            Course::create(['name' => $courseName]);
        }
    }
}