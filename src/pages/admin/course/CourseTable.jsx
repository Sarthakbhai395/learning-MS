import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllCoursesQuery } from "@/features/api/courseApi";
import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";



function CourseTable() {

  const navigate=useNavigate()
  const {data,isLoading,isError} = useGetAllCoursesQuery()

  if(isLoading) return <h1>Loading.....</h1>
  console.log(data)
  return (
    <div>
      <Button onClick={()=>navigate("create")}>Create a new course</Button>
      <div className="mt-10">
        <Table>
          <TableCaption>A list of your recent courses.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.courses.map((course) => (
              <TableRow key={course._id}>
                <TableCell className="font-medium">{course?.coursePrice || "NA"}</TableCell>
                <TableCell><Badge>{course?.isPublished ? "published" :"Draft"}</Badge></TableCell>
                <TableCell>{course?.courseTitle || "NA"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={()=>navigate(`${course._id}`)}><Edit/></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CourseTable;
