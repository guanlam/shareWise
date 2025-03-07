<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ChatGPTService
{
    protected $apiKey;
    protected $apiUrl = 'https://api.openai.com/v1/chat/completions';

    public function __construct()
    {
        $this->apiKey = ""; // store your key in config/services.php and .env
    }

    /**
     * Get a ChatGPT suggestion based on a prompt.
     *
     * @param string $prompt
     * @param float $temperature
     * @return string
     */
    // public function getSuggestion(string $prompt, float $temperature = 0.7): string
    // {
    //     $payload = [
    //         "model" => "gpt-3.5-turbo",
    //         "messages" => [6
    //             [
    //                 "role" => "system",
    //                 "content" => "You are a financial advisor."
    //             ],
    //             [
    //                 "role" => "user",
    //                 "content" => $prompt
    //             ]
    //         ],
    //         "temperature" => $temperature,
    //     ];

    //     $response = Http::withHeaders([
    //         'Content-Type' => 'application/json',
    //         'Authorization' => 'Bearer ' . $this->apiKey,
    //     ])->post($this->apiUrl, $payload);

    //     if ($response->successful()) {
    //         $result = $response->json();
    //         return $result['choices'][0]['message']['content'] ?? "No suggestion available.";
    //     }

    //     return "Error: Unable to retrieve suggestion.";
    // }


    public function getSuggestion(string $prompt, float $temperature = 0.7): string
{
    // Temporary dummy response for testing without consuming quota
    return "Based on your spending trends, consider reducing your dining expenses by 10% and increasing your savings.";
}
}
