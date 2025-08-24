<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'position',
        'department',
        'hire_date',
        'status'
    ];

    protected $casts = [
        'hire_date' => 'date'
    ];

    /**
     * Get the user that owns the employee (One-To-One inverse)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the review templates this employee is associated with (Many-To-Many)
     */
    public function reviewTemplates()
    {
        return $this->belongsToMany(ReviewTemplate::class, 'employee_review_template')
            ->withPivot('status', 'completed_at')
            ->withTimestamps();
    }

    /**
     * Get the files uploaded for this employee
     */
    public function files()
    {
        return $this->hasMany(FileUpload::class);
    }
}
