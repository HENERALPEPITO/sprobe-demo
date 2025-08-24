<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ReviewTemplate extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'criteria',
        'status',
        'created_by'
    ];

    protected $casts = [
        'criteria' => 'array'
    ];

    /**
     * Get the user who created this template (Many-To-One/Belongs To)
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the employees associated with this review template (Many-To-Many)
     */
    public function employees()
    {
        return $this->belongsToMany(Employee::class, 'employee_review_template')
            ->withPivot('status', 'completed_at')
            ->withTimestamps();
    }
}
