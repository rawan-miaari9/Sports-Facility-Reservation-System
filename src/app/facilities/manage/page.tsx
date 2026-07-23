import ManageFacilityView from '@/components/ManageFacilityView';

export default function ManageFacilityPage() {
  return (
    <main className="min-h-screen bg-background">
      <ManageFacilityView 
        editingFacility={null} 
        onSaveFacility={(facility) => {
          console.log('Successfully saved facility:', facility);
        }}
        onCancel={() => {
          console.log('Action cancelled');
        }}
      />
    </main>
  );
}