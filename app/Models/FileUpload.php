<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileUpload extends Model
{
    protected $fillable = [
        'employee_id',
        'filename',
        'original_filename',
        'mime_type',
        'path',
        'size'
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }
}
