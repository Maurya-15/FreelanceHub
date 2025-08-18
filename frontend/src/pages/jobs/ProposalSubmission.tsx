import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud } from "lucide-react";
import axios from "axios";
import { getApiUrl } from "@/lib/api";

const mockQuestions = [
  "What is your experience with React and Node.js?",
  "How would you approach the payment integration?",
  "Can you provide examples of similar e-commerce projects?",
];

const ProposalSubmission = () => {
    const { id } = useParams();
  const [coverLetter, setCoverLetter] = useState("");
  const [rate, setRate] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [answers, setAnswers] = useState(Array(mockQuestions.length).fill(""));
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // For job summary (right panel)
  const [job, setJob] = useState<any>(null);
  React.useEffect(() => {
    async function fetchJob() {
      try {
        const res = await axios.get(getApiUrl(`/api/jobs/${id}`));
        setJob(res.data.job);
      } catch (err) {
        // ignore
      }
    }
    fetchJob();
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleAnswerChange = (idx: number, value: string) => {
    setAnswers((prev) => prev.map((a, i) => (i === idx ? value : a)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // Validation
    if (!coverLetter.trim() || !rate.trim() || !timeframe.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await axios.post(
        getApiUrl(`/api/jobs/${id}/proposals`),
        {
          coverLetter,
          proposedBudget: rate,
          estimatedDuration: timeframe,
        },
        {
          headers: {
            'user-id': localStorage.getItem('userId') || '',
          },
        }
      );
      setSubmitting(false);
      setSubmitted(true);
    } catch (err: any) {
      setSubmitting(false);
      setError(err.response?.data?.message || err.message || 'Submission failed');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card rounded-xl p-10 shadow-lg flex flex-col items-center max-w-md w-full">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="mb-4 text-green-500">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-2xl font-bold mb-2 text-center">Application Submitted!</h2>
          <p className="text-muted-foreground mb-6 text-center">
            Your proposal has been sent to the client. You'll be notified if they're interested.
          </p>
          <Link to="/find-work">
            <Button className="w-full mb-3" size="lg">Find More Jobs</Button>
          </Link>
          <Link to="/freelancer/dashboard">
            <Button className="w-full" variant="outline" size="lg">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-10 bg-transparent">
        {/* Main Form Card */}
        <div className="flex-1 bg-card rounded-xl p-10 shadow-xl">
          <Link to={`/job/${id}`} className="text-muted-foreground text-sm mb-4 inline-block hover:underline">
            &larr; Back to Job
          </Link>
          <h1 className="text-3xl font-bold mb-1">Submit Proposal</h1>
          <p className="text-muted-foreground mb-8">
            Stand out from the competition with a compelling proposal
          </p>
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 mb-6 rounded border border-red-200 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cover Letter */}
            <div className="mb-6">
              <label className="font-medium mb-2 block">Cover Letter <span className="text-destructive">*</span></label>
              <Textarea
                placeholder="Introduce yourself and explain why you're the best fit for this project..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={4}
                maxLength={1000}
              />
              <div className="text-xs text-muted-foreground mt-1">{coverLetter.length}/1000 characters</div>
            </div>
            {/* Proposed Rate & Time */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="font-medium mb-2 block">Proposed Rate <span className="text-destructive">*</span></label>
                <div className="flex items-center gap-2">
                  <span className="bg-muted px-3 py-2 rounded-l">₹</span>
                  <Input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="font-medium mb-2 block">Estimated Time <span className="text-destructive">*</span></label>
                <select
                  className="w-full border rounded px-3 py-2 bg-background"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="">Select timeframe</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="3+ months">3+ months</option>
                </select>
              </div>
            </div>
            {/* Additional Questions */}
            <div className="mb-6">
              <label className="font-medium mb-2 block">Additional Questions</label>
              {mockQuestions.map((q, i) => (
                <div key={i} className="mb-4">
                  <div className="mb-1 font-medium text-sm">
                    {i + 1}. {q}
                  </div>
                  <Textarea
                    placeholder="Your answer..."
                    value={answers[i]}
                    onChange={(e) => handleAnswerChange(i, e.target.value)}
                    rows={2}
                  />
                </div>
              ))}
            </div>
            {/* Attachments */}
            <div className="mb-8">
              <label className="font-medium mb-2 block">Attachments (Optional)</label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center mb-2">
                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                <div className="mb-2 text-muted-foreground text-sm">Upload relevant files (portfolio, samples, etc.)</div>
                <Input type="file" multiple onChange={handleFileChange} className="mb-2" />
                {files.length > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {files.map((file, i) => (
                      <div key={i}>{file.name}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <Button className="w-full text-lg py-3" size="lg" type="submit" disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Proposal"}
            </Button>
          </form>
        </div>
        {/* Job Summary Panel */}
        <div className="hidden lg:block w-full max-w-sm">
          {job && (
            <div className="bg-card rounded-xl p-8 shadow-xl sticky top-10">
              <h2 className="text-xl font-bold mb-2">{job.title}</h2>
              <div className="mb-4 text-muted-foreground">{job.category}</div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Budget:</span>
                                      <span>₹{job.budget?.min?.toLocaleString()} - ₹{job.budget?.max?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Duration:</span>
                  <span>{job.duration}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">Skills:</span>
                  <span>{job.skills?.join(', ')}</span>
                </div>
              </div>
              <div className="mb-3">
                <span className="font-medium">Description:</span>
                <div className="text-muted-foreground text-sm mt-1 line-clamp-5">{job.description}</div>
              </div>
              <div className="mt-6">
                <span className="font-medium">Client Info</span>
                <div className="flex items-center gap-2 mt-2">
                  <img src={job.client?.profilePicture || "/api/placeholder/40/40"} alt={job.client?.name} className="w-8 h-8 rounded-full border" />
                  <span>{job.client?.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalSubmission;