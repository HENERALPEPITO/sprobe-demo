<?php

namespace App\Http\Controllers;

use App\Models\ReviewTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewTemplateController extends Controller
{
    public function index()
    {
        $templates = ReviewTemplate::orderBy('created_at', 'desc')->get();
        return Inertia::render('review-templates/index', [
            'templates' => $templates
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'criteria' => 'required|array',
        ]);

        ReviewTemplate::create([
            ...$validated,
            'created_by' => auth()->id()
        ]);

        return redirect()->back()->with('success', 'Review template created successfully.');
    }

    public function update(Request $request, ReviewTemplate $reviewTemplate)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'criteria' => 'required|array',
        ]);

        $reviewTemplate->update($validated);

        return redirect()->back()->with('success', 'Review template updated successfully.');
    }

    public function destroy(ReviewTemplate $reviewTemplate)
    {
        $reviewTemplate->delete();
        return redirect()->back()->with('success', 'Review template deleted successfully.');
    }
}
