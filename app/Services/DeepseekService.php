<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class DeepseekService
{
    protected $apiKey;
    protected $apiUrl = 'https://openrouter.ai/api/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = config('services.deepseek.key'); // Ensure your .env and config/services.php are set
    }

    /**
     * Get a budget suggestion from the Deepseek model.
     *
     * @param float $previousIncome The total income from the previous month.
     * @param float $previousExpense The total expense from the previous month.
     * @param float $forecastValue The forecasted expense for next month.
     * @return string
     */
    public function getBudgetSuggestion(
        float $previousIncome, 
        float $previousExpense, 
        float $forecastValue
    ): string {
        // Build a dynamic prompt
        $prompt = "A user had a total income of RM {$previousIncome} and a total expense of RM {$previousExpense} last month. " .
          "The forecasted expense for next month is RM {$forecastValue}. " .
          "Based on these figures, provide personalized budget adjustment suggestions that help the user manage their finances better. " .
          "Include actionable recommendations on reducing discretionary spending and improving overall savings. " .
          "Give the top 3 suggestions only, and output them as a numbered list with each suggestion on a new line (e.g., '...', '...', '...'). plain text, no need label 1. 2. 3. , no need style";


        $payload = [
            "model" => "deepseek/deepseek-r1:free", // Adjust to your chosen model
            "messages" => [
                [
                    "role" => "system",
                    "content" => "You are a helpful financial advisor."
                ],
                [
                    "role" => "user",
                    "content" => $prompt
                ]
            ],
            "temperature" => 0.7,
        ];

        $response = Http::timeout(200) // Set the timeout to 60 seconds
        ->withHeaders([
            "Authorization" => "Bearer " . $this->apiKey,
            "Content-Type" => "application/json",
        ])
        ->post($this->apiUrl, $payload);


        if ($response->successful()) {
            $result = $response->json();
            return $result['choices'][0]['message']['content'] ?? "No suggestion available.";
        }

        return "Error: Unable to retrieve suggestion.";
    }
}
