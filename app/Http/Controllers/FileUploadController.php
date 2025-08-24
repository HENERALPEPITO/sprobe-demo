<?php

namespace App\Http\Controllers;

use App\Models\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'employee_id' => 'required|exists:employees,id'
        ]);

        $file = $request->file('file');
        $filename = uniqid() . '_' . $file->getClientOriginalName();
        
        $path = $file->storeAs('employee-files', $filename, 'private');

        $upload = FileUpload::create([
            'employee_id' => $request->employee_id,
            'filename' => $filename,
            'original_filename' => $file->getClientOriginalName(),
            'mime_type' => $file->getMimeType(),
            'path' => $path,
            'size' => $file->getSize()
        ]);

        return redirect()->back()->with('success', 'File uploaded successfully.');
    }

    public function download(FileUpload $fileUpload)
    {
        abort_if(!Storage::disk('private')->exists($fileUpload->path), 404);
        
        return Storage::disk('private')->download(
            $fileUpload->path,
            $fileUpload->original_filename
        );
    }

    public function destroy(FileUpload $fileUpload)
    {
        abort_if(!Storage::disk('private')->exists($fileUpload->path), 404);
        
        Storage::disk('private')->delete($fileUpload->path);
        $fileUpload->delete();

        return redirect()->back()->with('success', 'File deleted successfully.');
    }
}
