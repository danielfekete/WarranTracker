import React from "react";

interface Props {
  issues: string[];
}

export default function FormIssues({ issues }: Props) {
  return (
    <div className="text-red-500">
      <ul>
        {issues.map((issue) => (
          <li key={issue} className="flex gap-1">
            {issue}
          </li>
        ))}
      </ul>
    </div>
  );
}
