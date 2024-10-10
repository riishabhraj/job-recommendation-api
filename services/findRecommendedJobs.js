const Job = require("../models/Job");

async function findRecommendedJobs(userProfile) {
  const { skills, experience_level, preferences } = userProfile;

  try {
    const jobs = await Job.find({
      $or: [
        { experience_level: experience_level },
        { location: { $in: preferences.locations.concat(["Remote"]) } },
        { job_type: preferences.job_type },
        { required_skills: { $in: skills } },
      ],
    });

    const rankedJobs = jobs.map((job) => {
      let matchScore = 0;

      const matchingSkills = job.required_skills.filter((skill) =>
        skills.includes(skill)
      ).length;
      matchScore += matchingSkills * 2;

      if (job.experience_level === experience_level) {
        matchScore += 3;
      }

      if (
        preferences.locations.includes(job.location) ||
        job.location === "Remote"
      ) {
        matchScore += 2;
      }

      if (job.job_type === preferences.job_type) {
        matchScore += 1;
      }

      return { job, matchScore };
    });

    const minimumScore = 3;
    const filteredJobs = rankedJobs.filter(
      ({ matchScore }) => matchScore >= minimumScore
    );

    filteredJobs.sort((a, b) => b.matchScore - a.matchScore);

    const recommendedJobs = filteredJobs.map(({ job }) => job);

    if (recommendedJobs.length === 0) {
      return { message: "No matching jobs found based on the given profile." };
    }

    return recommendedJobs;
  } catch (error) {
    console.error("Error finding recommended jobs:", error);
    throw error;
  }
}

module.exports = findRecommendedJobs;
