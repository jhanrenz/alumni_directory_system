<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;
class Event extends Model
{
    use SoftDeletes;

    protected $fillable = ['user_id',
    'title',
    'description',
    'date',
    'time',
    'location',
    'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public static function booted()
    {
        static::saving(function($event){
            $eventDate = Carbon::parse($event->date);

            if($eventDate->isPast()){
                $event->status = 'done';
            }else {
                $event->status = $event->status ?? 'upcoming';
            }
        });
    }
}
