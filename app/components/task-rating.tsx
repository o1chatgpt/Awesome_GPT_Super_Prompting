"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface TaskRatingProps {
  taskId: number | string
  initialRating?: number
  onRatingSubmit?: (rating: number, feedback: string) => void
}

export default function TaskRating({ taskId, initialRating = 0, onRatingSubmit }: TaskRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [feedback, setFeedback] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmit = () => {
    if (onRatingSubmit) {
      onRatingSubmit(rating, feedback)
    }
    setSubmitted(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate This Task</CardTitle>
        <CardDescription>Your feedback helps improve our AI and scraping capabilities</CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-center py-4">
            <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
            <p>Your feedback has been submitted and will help us improve.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="mb-2">How would you rate the results of this scraping task?</p>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill={star <= rating ? "gold" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="transition-all hover:scale-110"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
              <p className="text-center mt-2 text-sm text-muted-foreground">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            </div>

            <div>
              <p className="mb-2">Additional feedback (optional):</p>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what worked well or what could be improved..."
                rows={4}
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              Submit Feedback
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
