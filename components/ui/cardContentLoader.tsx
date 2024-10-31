import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
import { Label } from "./label";

export default function CardSkeletonComponent() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full h-48" />
      <CardHeader className="space-y-2">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-6 w-1/4" />
      </CardContent>
      <CardFooter className="flex gap-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

export function CategoryContentLoader() {
  return (
    <div className="w-64 flex-shrink-0">
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div key={index} className="space-y-1">
                  <Skeleton className="h-10 w-full" />
                  {index === 0 && (
                    <>
                      <Skeleton className="h-8 w-full ml-4" />
                      <Skeleton className="h-8 w-full ml-4" />
                      <Skeleton className="h-8 w-full ml-4" />
                    </>
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function FormContentLoader() {
  return (
    <Card className="w-full  mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
        <Button variant="ghost" className="text-sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <Label>
                <Skeleton className="h-4 w-24" />
              </Label>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <Label>
                <Skeleton className="h-4 w-24" />
              </Label>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((index) => (
            <div key={index} className="space-y-2">
              <Label>
                <Skeleton className="h-4 w-24" />
              </Label>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Label>
            <Skeleton className="h-4 w-24" />
          </Label>
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="space-y-2">
          <Label>
            <Skeleton className="h-4 w-24" />
          </Label>
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="space-y-4">
          <Label>
            <Skeleton className="h-4 w-32" />
          </Label>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-50 p-2 rounded"
              >
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <Skeleton className="h-4 w-16" />
        </Button>
        <Button>
          <Skeleton className="h-4 w-24" />
        </Button>
      </CardFooter>
    </Card>
  );
}
